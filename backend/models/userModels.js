
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// const validator = require('validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({ 
    name: {
        type: String,
        require: true,
        // unique: true
    },
    // reg_no: {
        // type: Number,
        // require: true,
        // unique: true
    // },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    picture: {
        type: String,
        // if user does not upload picture
        // default: ,
    }, 
    

}, { timestamps: true})

// ***************************************
userSchema.methods.matchPassword = async function (enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if(!this.isModified){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
// **************************************

module.exports = mongoose.model('user', userSchema);

























// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const validator = require('validator')

// const Schema = mongoose.Schema;

// // Create schema and model
// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,

//         // to validate that is is an actual email
//         // note I just added this based on research. It is not in the tutorial
//         validate: (val) => {
//             return validator.isEmail(val)
//         }
//     },
//     password: {
//         type: String,
//         required: true
//     }
// })

// // static signup method
// // ( while using the 'this' keyword, we can't use  the arrow function)
// userSchema.statics.signup = async function (email, password) {

//     // validation
//     // check if the mail and password both have values
//     if (!email || !password) {
//         throw Error('All fields must be filled')
//     }
//     // check if email is valid(if the email put in is an actual email)
//     if (!validator.isEmail(email)) {
//         throw Error('Email is not valid')
//     }
//     // check for if strong password
//     if (!validator.isStrongPassword(password)) {
//         throw Error('Password not strong enough')
//     }

//     // to check for replicated emails
//     const exists = await this.findOne({ email })

//     if (exists) {
//         throw Error('Emails already in use')
//     }

//     // for two different users use the same password
//     // the salt creates a different hash
//     const salt = await bcrypt.genSalt(10)
//     const hash = await bcrypt.hash(password, salt)

//     const user = await this.create({ email, password: hash })

//     return user
// }

// // static login method
// userSchema.statics.login = async function( email, password ){
//     // validation
//     // check if the mail and password both have values
//     if (!email || !password) {
//         throw Error('All fields must be filled')
//     }

    
//     // to find the user with email
//     const user = await this.findOne({ email })

//     // check if user exists or not
//     // if not, throw error
//     if (!user) {
//         throw Error('Incorrect email')
//     }

//     // match passwords with the hashed version, to compare
//     // two arguments:(
//     // 1. normal password value 
//     // 2. encrypted password version(hashed) 
//     // )
//     const match = await bcrypt.compare(password, user.password)

//     if( !match){
//         throw Error(' Incorrect password')
//     }

//     return user
// }

// module.exports = mongoose.model('user', userSchema);