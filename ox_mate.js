// ==UserScript==
// @name         Display Correct Metadata Comments
// @namespace    https://blog.frankie.science
// @version      1.6
// @description  Parse and display metadata comments with toggleable OFFERDOCS
// @author       Frankie
// @match        *://*/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/FrankieeW/scripts/refs/heads/main/ox_mate.js
// @updateURL    https://raw.githubusercontent.com/FrankieeW/scripts/refs/heads/main/ox_mate.js
// ==/UserScript==

(function () {
    'use strict';

    // 正则表达式匹配单个注释块
    const metadataRegex = /<!--\s*([\s\S]*?)\s*-->/g;

    // 子表达式解析注释内容
    const contentRegex = /docs:\s*(\d+),\s*#OFFERDOCS:\s*\|([^|]+(?:\|[^|]+)*)\|([^,]+),\s*#DALS:\s*([A-Z]+)/;

    // 获取页面 HTML 并匹配所有注释
    const pageContent = document.documentElement.innerHTML;
    const matches = [...pageContent.matchAll(metadataRegex)];

    const metadataList = [];

    // 遍历每个注释块
    matches.forEach(match => {
        const commentContent = match[1].trim();
        const contentMatch = commentContent.match(contentRegex);
        if (contentMatch) {
            metadataList.push({
                docs: contentMatch[1],
                offerDocsRaw: contentMatch[2],
                offerDocsDesc: contentMatch[3],
                dals: contentMatch[4]
            });
        }
    });

    if (metadataList.length > 0) {
        // 创建一个浮动窗口来显示数据
        const metadataBox = document.createElement('div');
        metadataBox.style.position = 'fixed';
        metadataBox.style.top = '10px';
        metadataBox.style.right = '10px';
        metadataBox.style.backgroundColor = '#f9f9f9';
        metadataBox.style.border = '1px solid #ccc';
        metadataBox.style.padding = '10px';
        metadataBox.style.zIndex = '10000';
        metadataBox.style.fontSize = '14px';
        metadataBox.style.fontFamily = 'Arial, sans-serif';
        metadataBox.style.color = '#333';
        metadataBox.style.maxHeight = '90%';
        metadataBox.style.overflowY = 'auto';

        metadataBox.innerHTML = `<b>Metadata Information</b><br>`;

        // 遍历每条注释内容并显示
        metadataList.forEach((metadata, index) => {
            const offerDocsList = metadata.offerDocsRaw.split('|');
            const offerDocsContent = `
                <ul>
                    ${offerDocsList.map(doc => `<li>${doc}</li>`).join('')}
                </ul>
                <b>Description:</b> ${metadata.offerDocsDesc}
            `;

            // 每个 OFFERDOCS 块的 HTML
            const offerDocsHTML = `
                <div>
                    <b>OFFERDOCS:</b> 
                    <button style="margin-left: 5px; font-size: 12px;" class="toggle-button">Hide</button>
                    <div class="offer-docs-content" style="margin-top: 5px;">
                        ${offerDocsContent}
                    </div>
                </div>
            `;

            metadataBox.innerHTML += `
                <div style="margin-bottom: 10px;">
                    <b>Comment #${index + 1}</b><br>
                    <b>Docs:</b> ${metadata.docs}<br>
                    ${offerDocsHTML}
                    <b>DALS:</b> ${metadata.dals}
                </div>
            `;
        });

        // 将浮动窗口添加到页面
        document.body.appendChild(metadataBox);

        // 添加隐藏/显示功能
        const toggleButtons = metadataBox.querySelectorAll('.toggle-button');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    button.textContent = 'Hide';
                } else {
                    content.style.display = 'none';
                    button.textContent = 'Show';
                }
            });
        });
    }
})();
