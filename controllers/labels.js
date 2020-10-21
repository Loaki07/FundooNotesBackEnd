import { ErrorResponse } from '../utility/errorResponse.js';
import logger from '../config/logger.js';
import RedisCache from '../middleware/redisCache.js';
import LabelService from '../services/labelService.js';
const { setDataintoCache } = new RedisCache();
const { createNewLabel } = new LabelService();

class LabelController {
  createLabelAndAddToNote = async (req, res) => {
    const responseData = {};
    try {
      const labelObject = {
        title: req.body.title,
        labelName: req.body.labelName,
        userId: req.user._id,
      };
      const result = await createNewLabel(labelObject);
      responseData.success = true;
      responseData.data = result;
      responseData.message = 'Label added to note successfully';
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };
}

export default LabelController;
