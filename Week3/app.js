'use strict';

const urlAPI = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

fetchJSON(urlAPI)
    .then(main)
    .catch(error => {

        const err = document.getElementById('root');
        err.innerHTML = 'Error:' + ' ' + error.message;
    });

function main(data) {

    const root = document.getElementById('root');

    const header = createAndAppend('div', root, {
        id: 'header'
    });

    const p = createAndAppend('p', header, {
        html: 'HYF Repositories' + ' ',
        id: 'titles'
    });
    const select = createAndAppend('select', p, {
        id: 'select'
    });

    const reposContainer = createAndAppend('div', root, {
        id: 'rep-container'
    });

    const contribContainer = createAndAppend('div', root, {
        id: 'cont-container'
    });

    select.addEventListener('change', ReposSelect);

    data.forEach(data => {
        const option = createAndAppend('option', select, {
            html: data.name
        });

    });
}

async function ReposSelect(e) {

    try {

        const hyfUrl = "https://api.github.com/repos/HackYourFuture/";

        const reposUrl = hyfUrl + e.target.value;

        const contUrl = hyfUrl + e.target.value + "/contributors";

        const repo = await fetchJSON(reposUrl);
        ReposInfo(repo);

        const cont = await fetchJSON(contUrl);
        contributorsInfo(cont);

    } catch (error) {

        const err = document.getElementById('root');
        err.innerHTML = 'Error:' + ' ' + error.message;
    }

}

function ReposInfo(repos) {

    const repContainer = document.getElementById('rep-container');
    repContainer.innerHTML = '';

    const p = createAndAppend('p', repContainer, {
        id: 'titles',
        html: 'Repository information:'

    });
    const ul = createAndAppend('ul', repContainer, {
        id: 'listStyle'
    });

    const repoLink = 'https://github.com/HackYourFuture/' + repos.name;

    const li = createAndAppend('li', ul, {
        html: 'Repository:' + " " +
            '<a href=' + repoLink + ' target="_blank"' + '>' + repos.name + '</a>'
    });
    createAndAppend('li', ul, {
        html: 'ID:' + " " + repos.id
    });
    createAndAppend('li', ul, {
        html: 'Fork:' + " " + repos.forks_count
    });
    createAndAppend('li', ul, {
        html: 'Updated:' + " " + repos.updated_at
    });
}

function contributorsInfo(contributors) {

    const contContainer = document.getElementById('cont-container');
    contContainer.innerHTML = '';

    const p = createAndAppend('p', contContainer, {
        html: 'Contributions :',
        id: 'titles'
    });

    for (let i = 0; i < contributors.length; i++) {

        const ul = createAndAppend('ul', contContainer, {
            id: 'eachContributor'
        });
        const li = createAndAppend('li', ul, {
            class: 'contributorsInfo'
        });
        const img = createAndAppend('img', li, {
            src: contributors[i].avatar_url,
            id: 'contributor-img'
        });
        const infoDiv = createAndAppend('div', li, {
            html: contributors[i].login,
            id: 'login'
        });
        createAndAppend('div', li, {
            html: contributors[i].contributions,
            id: 'contribution'
        })

    }
}

function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
        const value = options[key];
        if (key === 'html') {
            elem.innerHTML = value;
        } else {
            elem.setAttribute(key, value);
        }
    });
    return elem;
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    resolve(xhr.response);

                } else {
                    reject(new Error(xhr.statusText));
                }
            }
        };
        xhr.send();
    });

    window.onload = ReposSelect;
}