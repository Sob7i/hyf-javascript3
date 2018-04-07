'use strict';
{
    const motherUrl = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    function main() {

        const root = document.getElementById('root');
        const header = createAndAppend('div', root, { id: 'header' });
        const p = createAndAppend('p', header, { html: 'HYF Repositories' + ' ' });
        const select = createAndAppend('select', p
            , { id: 'select', 'aria-label': 'HYF Repositories' });
        const repContainer = createAndAppend('div', root, { id: 'rep-container' });
        const contContainer = createAndAppend('div', root, { id: 'cont-container' });

        fetchJSON(motherUrl)

            .then(data => {

                renderData(data);
            })
            .catch(error => {

                console.error(error.message);
            });

        function renderData(data) {

            const select = document.getElementById('select');
            select.addEventListener('change', theListener);

            data.forEach(data => {
                const option = createAndAppend('option', select, { html: data.name });

            });

            function theListener(event) {

                const hyfUrl = "https://api.github.com/repos/HackYourFuture/"
                const repUrl = hyfUrl + event.target.value;
                const contUrl = hyfUrl + event.target.value + "/contributors"

                fetchJSON(repUrl)
                    .then(repData => {

                        renderRepo(repData);
                    })
                    .catch(error => {

                        console.error(error.message);
                    });

                fetchJSON(contUrl)
                    .then(contData => {

                        renderContr(contData);
                    })
                    .catch(error => {

                        console.error(error.message);
                    })
            }

        }



        function renderRepo(repData) {

            const repContainer = document.getElementById('rep-container');
            repContainer.innerHTML = '';

            const ul = createAndAppend('ul', repContainer, {
                html: '<strong> Repository information: </strong>'
            });

            const repLink = 'https://github.com/HackYourFuture/' + repData.name;

            const li1 = createAndAppend('li', ul, {
                html: 'Repository:' + " "
                    + '<a href=' + repLink + '>' + repData.name + '</a>'
            });

            const li2 = createAndAppend('li', ul, { html: 'ID:' + " " + repData.id });
            const li3 = createAndAppend('li', ul, { html: 'Fork:' + " " + repData.forks_count });
            const li4 = createAndAppend('li', ul, { html: 'Updated:' + " " + repData.updated_at });

        }

        function renderContr(contData) {

            console.log(contData);

            const contContainer = document.getElementById('cont-container');
            contContainer.innerHTML = '';

            const ol = createAndAppend('ol', contContainer, {
                id: 'Contributors-style',
                html: '<strong>Contributors:</strong>'
            });

            for (let i = 0; i < contData.length; i++) {

                const contLink = ' https://github.com/' + contData[i].login;

                const li = createAndAppend('li', ol, {
                    class: 'contributors-info',
                    'aria-label': contData[i].login,
                    html: '<a href=' + contLink + '>' + contData[i].login + "  "
                        + '' + contData[i].contributions
                        + '<br>' + "<img id ='cont-img' src="
                        + contData[i].avatar_url + ">" + '</a>'
                });
            }

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
    }
    window.onload = main;
}

                               

