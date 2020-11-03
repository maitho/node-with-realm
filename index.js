/**
 * @author David Maitho
 * @email thigedavidmaitho@gmail.com
 * @create date 2020-08-11 00:34:48
 * @modify date 2020-08-11 00:38:52
 * @desc [description]
 */

const { app } = require('./express/expressApp')
const port = 5052
app.set('port', process.env.PORT || port)
app.listen(port, () => console.log(`Server Listening on port ${port}`))