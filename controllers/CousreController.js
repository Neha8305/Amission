const courseModel = require('../models/course')
class CourseController {
    static createCourse = async (req,res)=>{
        try {
            const{name,image,_id}=req.user
            
            const newCourse = new courseModel({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                tenth:req.body.tenth,
                twelth:req.body.twelth,
                course:req.body.course,
                userid:_id


            })
            await newCourse.save();
            res.redirect('/couseDisplay')
        }
        catch(error){
            console.log(error);
        }
    }
    static display = async (req,res)=>{
        try {
            const{name,image,_id}=req.user

            // const data = await courseModel.find()
            const data = await courseModel.find({ userid: _id })
            ;

            res.render('course/display',{data:data,n:name,i:image,userid:_id})

        } catch (error) {
            console.log(error);
        }
    }

    static view = async (req,res)=>{
        try{
            //console.log(req.params.id)
            const{name,image,_id}=req.user

          
            const data=await courseModel.findById(req.params.id)
            res.render('course/view',{view:data,n:name,i:image})
            //console.log(data)
    
        }catch(error){
            console.log(error)
        }
    }
    static edit = async(req,res)=>{
        try{
            const{name,image,_id}=req.user
            // console.log(req.params.id)
            const data=await courseModel.findById(req.params.id)
            res.render('course/edit',{edit:data,n:name,i:image})
    
        }catch(error){
            console.log(error)
        }
    }
    static update = async (rq,res)=>{
        try {
            const{name,image,_id}=req.user

            const data = await courseModel.findByIdAndUpdate(req.params.id,{
                
                    name:req.body.name,
                    email:req.body.email,
                    phone:req.body.phone,
                    tenth:req.body.tenth,
                    twelth:req.body.twelth,
                    course:req.body.course,


            })
            res.redirect('/couseDisplay')
            
        } catch (error) {
            console.log(error)
            
        }
    }
    static delete = async (req,res)=>{
        try {
            const data = await courseModel.findByIdAndDelete(req.params.id)
            res.redirect('/couseDisplay')

            
        } catch (error) {
            console.log(error)
            
        }
    }
    
}

module.exports = CourseController