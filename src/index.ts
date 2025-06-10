#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { object, z } from "zod";
import { getStampImages } from "./client.js";
import { processAndSaveImages, openDirectory, getSaveDir } from "./utils/image.js";
import { APP_NAME, APP_VERSION, MESSAGES, TOOL_CONFIG } from "./config.js";
import path from "path";
import os from "os";
import { log, logCodes } from "./utils/log.js";
import { getRegion } from "./api/index.js";
import { handleGetRegion } from "./utils/region.js";

/**
 *
 */
class McpError extends Error {
    public code: number;
    public data?: any;

    constructor(message: string, code: number, data?: any) {
        super(message);
        this.name = 'McpError';
        this.code = code;
        this.data = data;
    }

    static invalidParams(message: string, data?: any) {
        return new McpError(message, -32602, data);
    }

    static internalError(message: string, data?: any) {
        return new McpError(message, -32603, data);
    }

    static serverError(message: string, data?: any) {
        return new McpError(message, -32000, data);
    }
}



// Create MCP Server instance
const server = new McpServer({
    name: APP_NAME,
    version: APP_VERSION,
    capabilities: {
        resources: {},
        tools: {},
    },
});

/**
 * Handle stamp request and return result
 * @param prompt User input prompt text
 * @returns Processing result
 */
async function handleStampRequest(prompt: string, language: string) {
    if (language !== 'ja') {
        throw McpError.invalidParams(MESSAGES.language_not_supported, {
            type: 'LANGUAGE_NOT_SUPPORTED',
            language: language
        });
    }
    try {
        // Get stamp images
        const { images, error, logId } = await getStampImages(prompt);

        if (!images || !images.length) {
            if (error === MESSAGES.images_empty) {
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `${error}`,
                        },
                    ],
                };
            }
            throw McpError.serverError(
                error || MESSAGES.common_error,
                {
                    type: 'STAMP_RETRIEVAL_ERROR',
                    originalError: error,
                    prompt: prompt
                }
            );
        }
        
        const savedPaths = await processAndSaveImages(images, logId);

        const saveDir = getSaveDir(logId);
        setTimeout(() => {
            openDirectory(saveDir);
        }, 2000);

        return {
            content: [
                {
                    type: "text" as const,
                    text: `${MESSAGES.success} ${saveDir} 合計${savedPaths.length}枚の画像が返されました`,
                },
            ],
            result: {
                savedDirectory: saveDir,
                fileCount: savedPaths.length,
                files: savedPaths
            }
        };
    } catch (error) {
        console.error(error);
        
        if (error instanceof McpError) {
            throw error;
        }
        
        throw McpError.internalError(
            MESSAGES.common_error,
            {
                type: 'INTERNAL_ERROR',
                originalError: error instanceof Error ? error.message : String(error),
                prompt: prompt
            }
        );
    }
}

server.registerTool(
    APP_NAME,
    {
        description: TOOL_CONFIG.description,
        inputSchema: {
            prompt: z.string().describe(TOOL_CONFIG.promptDescription),
            language: z.string().describe(TOOL_CONFIG.languageDescription),
        },
    },
    async ({ prompt, language }) => handleStampRequest(prompt, language)
);

async function main() {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        handleGetRegion();
        
        log(logCodes.pv);
    } catch (error) {
        console.error("error:", error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
