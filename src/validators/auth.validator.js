const { z } = require("zod")

const signupSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6),
    role: z.enum(["buyer","seller"]).default("buyer")
});

const loginSchema = z.object({
    email:z.string().email(),
    password:z.string()
});

module.exports = {
    signupSchema,
    loginSchema
};