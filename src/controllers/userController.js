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
    const user = await User.findOne({ username });
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

export const edit = (req,res) => res.send("Edit User");
export const remove = (req,res) => res.send("Delete User");
export const logout = (req,res) => res.send("Logout");
export const see = (req,res) => res.send("See User");