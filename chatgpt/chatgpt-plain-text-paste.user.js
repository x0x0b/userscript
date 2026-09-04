// ==UserScript==
// @name         ChatGPT Plain Text Paste
// @namespace    chatgpt-plain-text-paste
// @version      1.0.0
// @description  ChatGPTへのテキスト貼り付けを常にプレーンテキストにする
// @match        https://chatgpt.com/*
// @match        https://www.chatgpt.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const EDITOR_SELECTORS = [
        '#prompt-textarea.ProseMirror[contenteditable="true"]',
        '#prompt-textarea[contenteditable="true"]',
        '#prompt-textarea[contenteditable="plaintext-only"]',
        '[data-testid="prompt-textarea"][contenteditable="true"]',
    ];

    function findEditor(event) {
        const path =
            typeof event.composedPath === 'function'
                ? event.composedPath()
                : [];

        for (const node of path) {
            if (!(node instanceof Element)) {
                continue;
            }

            for (const selector of EDITOR_SELECTORS) {
                const editor = node.closest(selector);

                if (editor) {
                    return editor;
                }
            }
        }

        return null;
    }

    function insertPlainText(editor, text) {
        editor.focus();

        // Firefox/Chromeのcontenteditableで最も安定して
        // 現在のカーソル位置・選択範囲へテキストを挿入できる。
        const inserted = document.execCommand(
            'insertText',
            false,
            text
        );

        if (inserted) {
            return;
        }

        // execCommandが使えない場合のフォールバック
        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);

        editor.dispatchEvent(
            new InputEvent('input', {
                bubbles: true,
                inputType: 'insertText',
                data: text,
            })
        );
    }

    document.addEventListener(
        'paste',
        (event) => {
            const editor = findEditor(event);

            if (!editor) {
                return;
            }

            const clipboard = event.clipboardData;

            if (!clipboard) {
                return;
            }

            // 画像・スクショ・ファイルはChatGPT標準処理に任せる
            const hasFile =
                clipboard.files.length > 0 ||
                Array.from(clipboard.items).some(
                    (item) => item.kind === 'file'
                );

            if (hasFile) {
                return;
            }

            const text = clipboard.getData('text/plain');

            if (!text) {
                return;
            }

            // ChatGPT / ProseMirrorに元のpasteを処理させない
            event.preventDefault();
            event.stopImmediatePropagation();

            insertPlainText(editor, text);
        },
        true
    );
})();
