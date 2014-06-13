(function () {
    var githuburl = 'https://api.github.com/users/';
    var BGithubCardPrototype = Object.create(HTMLElement.prototype, {
            username: {
                enumerable: true,
                get: function () {
                    return this.getAttribute('username');
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.root = this.createShadowRoot();
                    this.root.appendChild(this.template.content.cloneNode(true));
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', githuburl + this.username);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === xhr.DONE) {
                            if (xhr.status === 200) {
                                this.loadUser(JSON.parse(xhr.responseText));
                            }
                        }
                    }.bind(this);
                    xhr.send();
                }
            },
            loadUser: {
                enumerable: true,
                value: function (user) {
                    var anchor = this.root.target ? this : this.root;
                    anchor.querySelector('.user-account').innerHTML = this.username;
                    anchor.querySelector('.user-name').innerHTML = user.name;
                    anchor.querySelector('.user-avatar img').src = user.avatar_url;
                    anchor.querySelector('.user-repos').innerHTML = user.public_repos;
                    anchor.querySelector('.user-followers').innerHTML = user.followers;
                }
            }
        });
    window.BGithubCard = document.registerElement('b-github-card', { prototype: BGithubCardPrototype });
    Object.defineProperty(BGithubCardPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <style> .user { font-family:"Helvetica", Arial, sans-serif; display: inline-block; width: 265px; height: 300px; overflow: hidden; border-radius: 6px; position: relative; background-color: #2E353C; text-align: center; color: #fff; font-weight: 100; transition: background 1000ms ease-out; } .user dl, .user dd { margin: 0; } .user dt { display: none; } .user-data { background: #fff url("github.png") no-repeat 5px 5px; background-size: 25px; height: 85px; border: 1px solid #D5D5D5; border-bottom:0; } dd.user-avatar { display: inline-block; margin: 20px 0 10px; } .user-avatar img { border-radius: 100%; height: 120px; width: 120px; border: 3px solid #fff; vertical-align: middle; background-color: #fff; } dd.user-name, dd.user-account { margin: 5px 0; } .user-name { font-size: 24px; } .user-account { font-size: 16px; color: #999; margin: 5px 0; } .user-stats { border-top: 1px groove #999; position: relative; top: 155px; } .user-stats dd { padding: 10px 20px; } .user-repos, .user-following, .user-followers { display: inline-block; font-size: 22px; color: #999; } .user-repos:after, .user-following:after, .user-followers:after { content: attr(data-stats); text-transform: uppercase; display: block; font-size: 11px; color: #666; font-weight: normal; line-height: 1.7em; } </style> <article class="user"> <dl class="user-data"> <dt>Avatar:</dt> <dd class="user-avatar"> <img src=""> </dd> <dt>Fullname:</dt> <dd class="user-name"></dd> <dt>Account:</dt> <dd class="user-account"></dd> </dl> <dl class="user-stats"> <dt>Repos</dt> <dd class="user-repos" data-stats="repos"></dd> <dt>Followers</dt> <dd class="user-followers" data-stats="followers"></dd> </dl> </article> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());