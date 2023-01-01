//====Checking Internet Connection=====
window.addEventListener("offline", function() {
    document.getElementById("alert").innerHTML = "Error in Internet Connection";
})
window.addEventListener("online", function() {
    document.getElementById("alert").innerHTML = "";
})
//==================================================
function setCookie(cname, cvalue, exdays) {
    // The function for saving data as cookies-------------
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    document.getElementById("alert").innerHTML = "";
}
function getCookie(cname) {
    // The function for reading data from cookies--------------
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//==========================================================
function saveLocal(username, data){
    // The function for saving data in local storage-------
    localStorage.setItem(username, data);
}
//===========================================================
function readLocal(username){
    // The function for reading data from local storage--------
    let data = localStorage.getItem(username);
    return data;
}

//===========================================================
async function getUser() {
    // function to call for the user from either local_storage/cookies or github api.
    let username = document.getElementById("username").value


    // Comment out the code block below if you don't want to use LOCAL_STORAGE
    //--------------------------------------------------------------------------------------
    if (localStorage.getItem(username) == null) {
        let response = await fetch(`https://api.github.com/users/${username}`);

        var data = await response.json();

        let data_string = JSON.stringify(data);
        saveLocal(username, data_string);
        document.getElementById("alert").innerHTML = "";
    } else {
        let data_string = readLocal(username);
        var data = JSON.parse(data_string);
        document.getElementById("alert").innerHTML = "Data From Loacal Storage";
    }
    //--------------------------------------------------------------------------------------
    // Comment out the code block below if you don't want to use COOKIES
    if (getCookie(username) == "") {
        let response = await fetch(`https://api.github.com/users/${username}`);
        var data = await response.json();
        let data_string = JSON.stringify(data);
        setCookie(username, data_string, 1);
        document.getElementById("alert").innerHTML = "";
    } else {
        let data_string = getCookie(username);
        var data = JSON.parse(data_string);
        document.getElementById("alert").innerHTML = "Data from Cookies";
    }

    //==============Requesting Data from Github Apis, since Nothing Found in Locally=====
    //==================and Setting Each Data the Place====================================
    if (data.alert) {
        document.getElementById("left-cont").style.opacity = 0.35;
        document.getElementById("alert").innerHTML = "User Not Found | Try Again";
    } else {
        if (document.getElementById("alert").innerHTML == "User Not Found | Try Again") {
            document.getElementById("alert").innerHTML = "";
        }
        document.getElementById("left-cont").style.opacity = 1;
        if (data.avatar_url) {
            document.getElementById("avatar-img").src = data.avatar_url;
        }
        if (data.name) {
            document.getElementById("account-name").innerHTML = data.name
        } else {
            document.getElementById("account-name").innerHTML = "unknown"
        }
        if (data.bio) {
            document.getElementById("bio").innerHTML = data.bio;
        } else {
            document.getElementById("bio").innerHTML = "No Bio"
        }
        if (data.blog) {
            document.getElementById("blog").innerHTML = "blog: " + data.blog.replace('https://', 'www.');
        } else {
            document.getElementById("blog").innerHTML = "No Blog"
        }

        if (data.location) {
            document.getElementById("loc").innerHTML = data.location
        } else {
            document.getElementById("loc").innerHTML = "location not specified"
        }
        if (data.followers) {
            document.getElementById("followers").innerHTML = data.followers
        } else {
            document.getElementById("followers").innerHTML = "unknown"
        }
        if (data.following) {
            document.getElementById("following").innerHTML = data.following
        } else {
            document.getElementById("following").innerHTML = "unknown"
        }
    }
    // ==========================getting favourite language=======================
    // ============================of the Searched User===============================
    let languages = [];
    const response = fetch(data.repos_url);
    response
        .then((response) => response.json())
        .then((repositories) => {
            for (let index = 0; index < 5; index++) {
                let repo = repositories[index];
                if (repo.language) {
                    languages.push(repo.language);
                }
            }
            let count = {};
            languages.forEach(function (i) {
                count[i] = (count[i] || 0) + 1;
            });
            let max = 0;
            let likely_language = null;
            for (index in count) {
                if (count[index] > max) {
                    max = count[index];
                    likely_language = index;
                }
            }
            if (likely_language) {
                document.getElementById("likely_language").innerHTML = likely_language;
            } else {
                document.getElementById("likely_language").innerHTML = 'Not Specified';
            }
        });
}