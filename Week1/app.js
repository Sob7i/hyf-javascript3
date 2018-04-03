'use strict';
{
    const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    function main(data) {

        const root = document.getElementById('root');
        const h1 = createAndAppend('h1', root, { html: 'HYF Repositories:' });
        const header = createAndAppend('div', root);
        const select = createAndAppend('select', header, { placeholder: 'Select a repository' });
        select.addEventListener("change", theListener);

        data.forEach(repository => {
            const option = createAndAppend('option', select, { value: repository.name, html: repository.name });
        });
        const repContainer = createAndAppend('div', root);
        repContainer.id = 'rep-container';
        const contContainer = createAndAppend('div', root);
        contContainer.id = 'cont-container';
    }

    function theListener(event) {

        const urlContributors = 'https://api.github.com/repos/HackYourFuture/' + event.target.value + '/contributors';
        const urlRepositories = 'https://api.github.com/repos/HackYourFuture/' + event.target.value;

        fetchJSON(urlContributors, contInfo);
        fetchJSON(urlRepositories, RepSelect);
    }

    function RepSelect(error, repData) {

        if (error !== null) {
            console.error(error.message);

        } else {
            renderRep(repData);
        }

    }

    function renderRep(repData) {

        const repContainer = document.getElementById('rep-container');
        repContainer.innerHTML = '';

      //  const list = createAndAppend('div', repContainer, { id: 'list-container' });
        const ul = createAndAppend('ul', repContainer, { html: '<strong> Repository information: </strong>' });
        const li1 = createAndAppend('li', ul, { html: 'Repository:' + " " + repData.name });
        const li2 = createAndAppend('li', ul, { html: 'Fork:' + " " + repData.forks_count });
        const li3 = createAndAppend('li', ul, { html: 'Updated:' + " " + repData.updated_at });

    }

    function contInfo(error, contData) {

        if (error !== null) {
            console.error(error.message);

        } else {
            renderCont(contData);
        }

    }

    function renderCont(contData) {

        const contContainer = document.getElementById('cont-container');
        contContainer.innerHTML = '';

        const ol = createAndAppend('ol', contContainer, { id: 'Contributors-style', html: '<strong>Contributors:</strong>' });

        contData.forEach(contData => {
            const li = createAndAppend('li', ol, {
                html: " " + contData.login + " " +
                    contData.contributions + '<br>' + "<img src=" + contData.avatar_url + ">"
            });

        });
    }

    function callback(error, data) {

        if (error !== null) {
            console.error(error.message);

        } else {
            main(data);

        }
    }
    fetchJSON(url, callback);


    function fetchJSON(url, cb) {

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {

            if (xhr.readyState === 4) {

                if (xhr.status < 400) {
                    cb(null, xhr.response);

                } else {
                    cb(new Error(xhr.statusText));
                }
            }
        }
        xhr.send();
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

    window.onload = theListener;
}
