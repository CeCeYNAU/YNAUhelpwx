const CAMPUS_PLACES = require('./campusPlaces');

const TIME_SLOTS = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];

const TEMPLATES = [
  (place, count, time) => `${time}，你在${place}与${count}位同学擦肩而过`,
  (place, count, time) => `${time}时段，有${count}人和你同时出现在${place}`,
  (place, count, time) => `今天的${time}，你在${place}遇到了${count}位校友`,
];

function generateMessage(placeName, count, timeSlot) {
  const tpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  return tpl(placeName, count, timeSlot);
}

function generateTodayIntersections() {
  const today = new Date().toDateString();

  try {
    const cached = wx.getStorageSync('intersectionData');
    if (cached && cached.date === today && cached.records && cached.records.length > 0) {
      return cached.records;
    }
  } catch (e) {}

  const records = [];
  const numPlaces = 3 + Math.floor(Math.random() * 4);
  const shuffled = [...CAMPUS_PLACES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(numPlaces, shuffled.length); i++) {
    const place = shuffled[i];
    const count = 2 + Math.floor(Math.random() * 15);
    const timeIdx = Math.floor(Math.random() * TIME_SLOTS.length);

    records.push({
      id: 'inter_' + Date.now() + '_' + i,
      placeId: place.id,
      placeName: place.title,
      category: place.category,
      latitude: place.latitude,
      longitude: place.longitude,
      timeSlot: TIME_SLOTS[timeIdx],
      count: count,
      color: place.color,
      desc: place.desc || '',
      message: generateMessage(place.title, count, TIME_SLOTS[timeIdx])
    });
  }

  try {
    wx.setStorageSync('intersectionData', { date: today, records: records });
  } catch (e) {}

  return records;
}

module.exports = {
  generateTodayIntersections,
  generateMessage
};
