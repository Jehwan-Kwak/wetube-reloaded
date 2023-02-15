import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req,res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async (req,res) => {
    const {username, password, password2, email, name, location} = req.body;
    if(password !== password2) {
        return res.status(400).render("join", {pageTitle: "Join", errorMessage:"Password confirmation does not match"})
    };
    const userExists = await User.exists({$or:[{username}, {email}]});
    if(userExists) {
        return res.status(400).render("join", {pageTitle: "Join", errorMessage:"This username/E-mail is already taken."})
    };
    try {
        await User.create({
          username, password, email, name, location,
        });
        return res.redirect("/login");
    } catch(error) {
        res.status(400).render("join", {pageTitle: "Join", errorMessage: error._message});
    }
    };

export const getLogin = (req,res) => res.render("login", {pageTitle: "Login"});

export const postLogin = async (req,res) => {
    const {username, password} = req.body;
    const pageTitle = "Login"
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        res.status(400).render("login", {pageTitle, errorMessage: " An account with this username does not exist."});
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        res.status(400).render("login", {pageTitle, errorMessage: "Wrong password"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString ();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl,
       {method: "post",
       headers: {
        Accept: "application/json",
       }
    })).json();
    if ("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const userData = await (await fetch("https://api.github.com/user", {
            headers : {
                Authorization : `token ${access_token}`
            }
        })).json();
        const emailData = await (await fetch("https://api.github.com/user/emails", {
            headers : {
                Authorization : `token ${access_token}`
            }
        })).json();
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({email : emailObj.email});
        if (!user) {
            const user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                password: " ",
                email: emailObj.email,
                location: userData.location,
                socialOnly: true,
            })
            }
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/"); 
        } else {
        res.redirect("/login");
        }
};

export const logout = (req,res) => {
    req.session.destroy();
    return res.redirect("/");
}; 

export const getEdit = (req, res) => {
    res.render("edit-profile", {pageTitle:"Edit profile"});
}
export const postEdit = (req, res) => {
    res.render("edit-profile", {pageTitle:"Edit profile"});
}
export const edit = (req,res) => res.send("Edit User");
export const remove = (req,res) => res.send("Delete User");
export const see = (req,res) => res.send("See User");

