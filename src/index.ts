import express from "express"

const main = async () => {
    const port = process.env.PORT || 7000

    const app = express()
    app.listen(port, () => console.log(`Server is running on port ${port}`))

    app.get('/greet/:what', (req, res) => res.json({greeating:`Ciao a ${req.params.what}`}))

}

main()