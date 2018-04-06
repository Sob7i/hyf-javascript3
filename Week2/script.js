'use strict';
{
    const apiUrl = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    const repsUrl = apiUrl.name;

    function main() {

        const root = document.getElementById('root');

        const h1 = createAndAppend('h1', root, { html: 'HYF Repositories:' });
        const header = createAndAppend('div', root);
        const select = createAndAppend('select', header, { placeholder: 'Select a repository' });
        // select.addEventListener("change", theListener);
        select.addEventListener("change", () => fetchAndRender());

        data.forEach(repository => {
            const option = createAndAppend('option', select, { html: repository.name });
        });

        const repContainer = createAndAppend('div', root);
        repContainer.id = 'rep-container';
        const contContainer = createAndAppend('div', root);
        contContainer.id = 'cont-container';


    }

    function fetchAndRender() {

        const pre = document.getElementById('response');
        const apiUrl = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

        fetchJSON(apiUrl)
            .then(data => {
                const repsUrl = apiUrl.name;
                return fetchJSON(repsUrl)
                    .then(data => {
                        const contUrl = apiUrl.contributors_url;
                        return fetchJSON(contUrl)
                            .then(data => {
                                return result = {
                                    repositories: apiUrl.name,
                                    contributors: apiUrl.contributors_url
                                };
                                pre.innerHTML = JSON.stringify(result, null, 2);
                            });
                    })
                    .catch(err => {
                        pre.innerHTML = err.message;
                    });
            })
    }
    fetchAndRender(repsUrl);
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

}