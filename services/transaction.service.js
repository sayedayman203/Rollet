const Transaction = require("../models/transaction.model");
const { nextTransaction } = require("../services/setting.service");
const { getUserByUserName } = require("./user.service");

exports.getTransactions = async ({ userName, page, limit }) => {
  if (!page || page < 1) page = 1;
  if (!limit || limit < 1) limit = 10;
  const skip = page * limit - limit;

  let query = {};
  return new Promise(async (resolve, reject) => {
    try {
      if (userName) {
        try {
          const user = await getUserByUserName(userName);

          if (user) query.to = user._id;
        } catch (e) {}
      }

      const count = await Transaction.countDocuments(query);
      const pages = Math.ceil(count / limit);
      let pagination = {
        total: count,
        pages,
        page,
        limit,
        hasNext: page < pages ? true : false,
        next: page < pages ? page + 1 : null,
        hasPrev: page > 1 ? true : false,
        prev: page > 1 ? page - 1 : null,
      };

      if (pagination.page > pagination.pages)
        return resolve({
          data: [],
          pagination,
        });

      const data = await Transaction.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: "desc" })
        .populate("from", "userName -_id")
        .populate("to", "userName -_id");

      resolve({
        data,
        pagination,
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

exports.addPoints = async ({ points, from, to }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transactionId = await nextTransaction();

      // create new transaction
      const newTransaction = new Transaction({
        transactionId,
        from,
        to,
        points,
      });

      // save user
      await newTransaction.save();
      await resolve();
    } catch (err) {
      reject(err);
    }
  });
};
