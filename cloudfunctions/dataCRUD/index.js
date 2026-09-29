// 云函数：dataCRUD - 通用数据操作
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

const COLLECTIONS = {
  forum: 'forum_posts',
  todo: 'user_todos',
  lost: 'lost_items',
  found: 'found_items',
  scenery: 'scenery_photos',
  voice: 'voice_messages',
  study: 'study_records',
  activity: 'activities',
  news: 'user_posts',
  course: 'user_courses'
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { action, collection, data, id, query, pageSize = 20, pageNum = 1 } = event;

  const collName = COLLECTIONS[collection];
  if (!collName) {
    return { code: -1, msg: '无效的集合名' };
  }

  const coll = db.collection(collName);

  try {
    switch (action) {
      case 'create': {
        if (!data) return { code: -1, msg: '缺少数据' };
        const insertData = {
          ...data,
          _openid: openid,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        const result = await coll.add({ data: insertData });
        return { code: 0, data: { _id: result._id } };
      }

      case 'list': {
        let q = coll;
        if (query) {
          q = coll.where(query);
        }
        const countResult = await q.count();
        const total = countResult.total;

        const skip = (pageNum - 1) * pageSize;
        const listResult = await q
          .orderBy('createdAt', 'desc')
          .skip(skip)
          .limit(pageSize)
          .get();

        return {
          code: 0,
          data: {
            list: listResult.data,
            total,
            pageNum,
            pageSize
          }
        };
      }

      case 'detail': {
        if (!id) return { code: -1, msg: '缺少ID' };
        const result = await coll.doc(id).get();
        return { code: 0, data: result.data };
      }

      case 'update': {
        if (!id || !data) return { code: -1, msg: '缺少参数' };
        const doc = await coll.doc(id).get();
        if (doc.data._openid !== openid) {
          return { code: -2, msg: '无权修改' };
        }
        await coll.doc(id).update({
          data: { ...data, updatedAt: Date.now() }
        });
        return { code: 0, msg: '更新成功' };
      }

      case 'delete': {
        if (!id) return { code: -1, msg: '缺少ID' };
        const doc = await coll.doc(id).get();
        if (doc.data._openid !== openid) {
          return { code: -2, msg: '无权删除' };
        }
        await coll.doc(id).remove();
        return { code: 0, msg: '删除成功' };
      }

      case 'increment': {
        if (!id || !data) return { code: -1, msg: '缺少参数' };
        const updateData = {};
        Object.keys(data).forEach(key => {
          updateData[key] = _.inc(data[key]);
        });
        await coll.doc(id).update({ data: updateData });
        return { code: 0, msg: '操作成功' };
      }

      case 'myList': {
        const skip = (pageNum - 1) * pageSize;
        const countResult = await coll.where({ _openid: openid }).count();
        const listResult = await coll
          .where({ _openid: openid })
          .orderBy('createdAt', 'desc')
          .skip(skip)
          .limit(pageSize)
          .get();

        return {
          code: 0,
          data: {
            list: listResult.data,
            total: countResult.total,
            pageNum,
            pageSize
          }
        };
      }

      default:
        return { code: -1, msg: '未知操作' };
    }
  } catch (e) {
    console.error('dataCRUD error:', e);
    return { code: -1, msg: e.message || '操作失败' };
  }
};
