const { User } = require("../models/User")

/**
 * @Usage Authorization
 * @param {*} actions Array of actionName
 */
function checkAction(actions) {
  return async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.user.id } })
    // check if user has any permission
    const permissions = await user.getPermissions()
    if (!permissions) return res.status(403).json({ status: 403, message: 'This user has no permission' })
    // loop for every action in actions array, parse to next middleware if all action allowed
    for (const action of actions) {
      let check = false
      // loop over permissions of user
      for (const permission of permissions) {
        const detail = (await permission.getPermissionDetails({ where: { actionName: action } }))[0]
        if (detail) if (detail.checkAction === true) check = true
      }
      // one action is not allowed so response access forbidden
      if (check === false) return res.status(403).json({ status: 403, message: 'Access forbidden' })
    }

    return next()
  }
}

module.exports = {
  checkAction
}
