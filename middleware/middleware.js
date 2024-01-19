
const User=require("../model/user");
const blog=require("../model/blog");
const getAllBlogsadmin = async (req, res) => {
    try {
        let blogsadmin = await blog.find({}).populate("user");
        res.render('adminhome', { blogsadmin });
    } catch (error) {
        res.send('Error');
    }
};
const getAllBlogs= async (req, res) => {
    try {
        let blogsadmin = await blog.find({}).populate("user");
        res.render('home', { blogsadmin });
    } catch (error) {
        res.send('Error');
    }
};
const getBlogByUser = async (req, res) => {
    try {
        let blogs=await blog.find({user:req.session.user._id}).populate("user");
        console.log(blogs);
        res.render('userhome', { blogs });
    } catch (error) {
        console.error('Error in getAllBlogsadmin function:', error);
        res.send('Error');
    }
};

  const deleteBlog = async (req, res) => {
    const user=req.session.user;
    const blogId = req.params.blogId;
  console.log(blogId);
    try {
       
      const blogInstance = await blog.findById(blogId);

   await blog.findByIdAndDelete(blogId);
      const userblog = await User.findOne({ _id: blogInstance.user });
      await User.findByIdAndUpdate(userblog._id, { $pull: { blog: blogId } });

   if(user.username=="admin"){
        res.redirect('admin/home');
}else{ res.redirect('user/home') ;}
    } catch (error) {
      console.error(error);
      res.send("Error");
    }
  };
  const fullblog = async(req,res)=>{
    const blogIdd = req.params.blogId;
    const blogInstance = await blog.findById(blogIdd).populate('user');
    console.log(blogInstance);
    res.render("fullblog",{blogInstance});
  }
const notification= async (req, res) => {
    try {
        let blogsadmin = await blog.find({}).populate("user");
        res.render('notification', { blogsadmin });
    } catch (error) {
        res.send('Error');
    }
  };
const approve=async(req,res,next)=>{
      // console.log(req.params.blogId);
      const blogId=req.params.blogId;
      const blogInstance = await blog.findById(blogId).populate('user');
      blogInstance.verify=true;
      await blogInstance.save();
      next();
    }
module.exports={
    getAllBlogsadmin,
    getAllBlogs,
    getBlogByUser,
    deleteBlog,
    fullblog,
    approve,
    notification

}  