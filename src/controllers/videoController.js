let videos = [
    {
        title:"First video",
        rating:2,
        comments:18,
        createdAt:"3 minutes ago",
        views: 1,
        id: 1, 
    },
    {
        title:"Second video",
        rating:2,
        comments:18,
        createdAt:"3 minutes ago",
        views: 59,
        id: 2, 
    },
    {
        title:"Third video",
        rating:2,
        comments:18,
        createdAt:"3 minutes ago",
        views: 59,
        id: 3, 
    },
]

export const trending = (req,res) => res.render("home", {pageTitle : "Home", videos})
export const edit = (req,res) => res.render("edit");
export const watch = (req,res) => {
    const { id } = req.params;
    const video = videos[id-1];
    return res.render("watch", {pageTitle:`Watching ${video.title}`, video});
};
export const search = (req,res) => res.send("Search");
export const upload = (req,res) => res.send("Upload");
export const deleteVideo = (req,res) => res.send("Delete Video");
