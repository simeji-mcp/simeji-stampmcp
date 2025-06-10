# スタンプ超変換MCPとは？

## 一、スタンプ超変換MCPとは？

- 累計ダウンロード数が7,000万を超え、Z世代に人気のキーボードアプリ「Simeji」が、「スタンプ超変換MCPサービス」の提供を開始しました。
- 特定のキーワードを入力するだけで、そのキーワードに関連するスタンプが自動で生成されます。
- Simejiのスタンプ超変換MCPをご利用中に問題が発生した場合は、[こちらのフォーム](https://forms.gle/AtmXCXDXGCsXSNB1A)よりご連絡ください。

## 二、Simeji MCPの主な機能

1. **入力**：スタンプ利用コマンドを入力してください。例：悲しい／楽しいスタンプを使う（入力は日本語に限ります）
2. **出力**：キーワードに関連する多様なスタンプ素材
3. **キーワード表示の有無を選択可能**：生成されるスタンプにキーワードを表示するかどうかを選べます
4. **スタンプ保存**：出力されたスタンプはローカルフォルダに保存され、ご自由にご利用いただけます

## 三、設定項目の説明

1. **STAMP_API_KEY**：プラットフォーム上で取得したAPIキー
2. **NEED_PASTE**：オプション値（"0" または "1"）。デフォルトは"0"で、スタンプにキーワードを表示しません。"1"に設定すると表示されます。

## 四、ご利用にあたっての注意事項

1. ご利用前に、開発者アカウントの登録とログインが必要です。サービス利用にはAPIキーの取得が必要です。
2. 1ユーザーにつき、最大2つのAPIキーまで作成可能です（削除・再作成は可）。
3. 超変換MCP利用のリクエストの上限は、APIキーごとにではなくユーザー単位で管理されます。
4. 24時間あたり、1ユーザーにつきリクエストの上限は30回までとなります。

## 五、Node.jsによる接続方法

1. Node.jsのインストール：https://nodejs.org/ja
2. Claudeでの設定

- Claudeの「Setting（設定）」メニューを開き、「Developer（開発者）」タブに切り替えます。「Edit Config（設定を編集）」をクリックし、任意のテキストエディタソフトで設定ファイルを開いてください。

![Claude設定画面](https://d1yon1ba9a2ouz.cloudfront.net/static/wapplus/claude-settings-99a4145c.png)

![Claude設定画面](https://d1yon1ba9a2ouz.cloudfront.net/static/wapplus/claude-settings-2-e7c4874b.jpg)

- 以下のコードを claude_desktop_config.json ファイルに書き込んでください

- 設定項目の説明
  - STAMP_API_KEY：プラットフォーム上で取得したAPIキー
  - NEED_PASTE：オプション値（"0" または "1"）。デフォルトは"0"で、スタンプにキーワードを表示しません。"1"に設定すると表示されます。

![claude_desktop_config.json](https://d1yon1ba9a2ouz.cloudfront.net/static/wapplus/claude-settings-3-bebe1c15.jpg)

```javascript
{
    "mcpServers": {
        "simeji-stampmcp": {
            "command": "npx",
            "args": [
                "-y",
                "simeji-stampmcp"
            ],
            "env": {
                "STAMP_API_KEY": "{apikey}"
            }
        }
    }
}
```

![Claude設定画面](https://d1yon1ba9a2ouz.cloudfront.net/static/wapplus/claude-settings-4-18a38442.png)

![Claude設定画面](https://d1yon1ba9a2ouz.cloudfront.net/static/wapplus/claude-settings-5-97f034b7.png)
