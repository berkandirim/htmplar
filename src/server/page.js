/**
 * page
 **/

const defaultCfg = require('../../.htmplarrc.json');
const {output, sharedContent} = require('rc')('htmplar', defaultCfg);
const {walkSync} = require('../utils');

const pages = [];

const getPage = fileData => {
    if (fileData.dir !== sharedContent) {
        let fileDir = fileData.dir.split(output);
        let href = fileDir[fileDir.length - 1];
        let fileName = fileData.dir.split('/');
        let pageName = fileName[fileName.length - 1].replace('-', ' ');

        return {
            pageName: pageName,
            href: href
        };
    }
    return null;
};

const setPage = pageData => {
    let listItem =
        `<li style="padding: 8px 16px 8px 8px; border-bottom: 1px solid #ddd;">
            <a style="width: 100%;
                    display: inline-block;
                    padding: 8px 16px 8px 8px;
                    position: relative;
                    text-decoration: none;
                    color: #000;" 
                href="${pageData.href}"
            >
                ${pageData.pageName}
            </a>
        </li>`;

    if (pages.indexOf(listItem) === -1) {
        pages.push(listItem);
    }
};

walkSync(output).forEach(file => {
    let page = getPage(file);
    if (page) {
        setPage(page);
    }
});

module.exports = pages;