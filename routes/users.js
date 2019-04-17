var express = require('express');
var router = express.Router();
var userFacade = require('../facades/userFacade')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  users = await userFacade.getAllUsers();
  res.send(users);
});

router.post('/add', async function (req, res, next) {
  user = await userFacade.addUser(req.body);

  res.send(user);
});

router.post("/login", async (req, res, next) => {
  user = await userFacade.login(req.body);
  await console.log(user)
  if (user == null) {
    res.json({ msg: "wrong username or password", status: 403 });
  }
  else {
    users = await userFacade.findNearbyUsers(req.body.longitude, req.body.latitude, req.body.distance)
    res.json({
      friends: users.map((el) => {
        user = {
          "username": el.user.firstName,
          "longitude": el.loc.coordinates[0],
          "latitude": el.loc.coordinates[1]
        }
        return user;
      })
    })
  }
})


module.exports = router;