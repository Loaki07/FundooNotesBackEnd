import logger from '../config/logger.js';
import RedisCache from '../middleware/redisCache.js';
import LabelService from '../services/labelService.js';
const { setDataintoCache } = new RedisCache();
const { createNewLabel, deleteLabelFromNote, getLabels } = new LabelService();

class LabelController {

  /**
   * @description Creates a label and adds it to the note
   * @route POST /labels
   * @param {Object} req 
   * @param {Object} res 
   */
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
      responseData.message = 'Showing All Labels from DataBase';
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  /**
   * @description Deletes label in db and note
   * @route DELETE /labels
   * @param {Object} req 
   * @param {Object} res 
   */
  deleteLabel = async (req, res) => {
    const responseData = {};
    try {
      const labelObject = {
        title: req.body.title,
        labelName: req.body.labelName,
      };
      const result = await deleteLabelFromNote(labelObject);
      responseData.success = true;
      responseData.data = result;
      responseData.message = 'Deleted Label from note successfully';
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  /**
   * @description Gets all the labels from db
   * @route GET /labels
   * @param {Object} req 
   * @param {Object} res 
   */
  getAllLabels = async (req, res) => {
    const responseData = {};
    try {
      const result = await getLabels();
      responseData.success = true;
      responseData.data = result;
      responseData.message = 'Deleted Label from note successfully';
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
