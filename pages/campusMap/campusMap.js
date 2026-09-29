const CAMPUS_PLACES = require('../../constants/campusPlaces');
const { generateTodayIntersections } = require('../../constants/intersections');
const app = getApp();

Page({
  data: {
    latitude: 25.1415,
    longitude: 102.7379,
    scale: 16,
    markers: [],
    showCard: false,
    selectedPlace: null,
    enableSatellite: false,
    currentView: 'map',
    intersectionRecords: [],
    totalCount: 0
  },

  onShow() {
    this.initMarkers();
    this.loadIntersections();
  },

  onLoad() {
    this.loadIntersections();
  },

  initMarkers() {
    const markers = CAMPUS_PLACES.map(p => ({
      id: p.id,
      latitude: p.latitude,
      longitude: p.longitude,
      title: p.title,
      iconPath: '/images/star_icon.png',
      width: 30,
      height: 30,
      callout: { content: p.title, display: 'BYCLICK', borderRadius: 8, bgColor: p.color, color: '#fff', padding: 6 },
      desc: p.desc,
      category: p.category,
      tips: p.tips
    }));
    this.setData({ markers });
  },

  loadIntersections() {
    const records = generateTodayIntersections();
    const totalCount = records.reduce((sum, r) => sum + r.count, 0);
    this.setData({ intersectionRecords: records, totalCount });
  },

  toggleView() {
    wx.vibrateShort({ type: 'light' });
    this.setData({
      currentView: this.data.currentView === 'map' ? 'list' : 'map'
    });
  },

  onInterTap(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.intersectionRecords[index];
    if (!record) return;
    this.setData({
      currentView: 'map',
      latitude: record.latitude,
      longitude: record.longitude,
      scale: 17,
      showCard: true,
      selectedPlace: {
        ...record,
        title: record.placeName,
        desc: record.timeSlot + '，' + record.count + '人次交集',
        tips: ['时间段：' + record.timeSlot, '交集人次：' + record.count, '类别：' + record.category]
      }
    });
  },

  onMarkerTap(e) {
    const markerId = e.currentTarget.dataset.id;
    const place = this.data.markers.find(m => m.id === markerId);
    if (!place) return;
    const interRecord = this.data.intersectionRecords.find(r => r.placeId === markerId);
    const enhancedPlace = interRecord
      ? { ...place, count: interRecord.count, timeSlot: interRecord.timeSlot, desc: interRecord.desc || place.desc }
      : place;
    this.setData({ showCard: true, selectedPlace: enhancedPlace });
  },

  closeCard() {
    this.setData({ showCard: false, selectedPlace: null });
  },

  stop() {},

  navigateToPlace() {
    const { selectedPlace } = this.data;
    if (!selectedPlace || !selectedPlace.latitude || !selectedPlace.longitude) {
      wx.showToast({ title: '位置信息不完整', icon: 'none' });
      return;
    }
    wx.openLocation({
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      name: selectedPlace.title || selectedPlace.placeName,
      address: '云南农业大学校园内',
      scale: 16
    });
    this.closeCard();
  },

  toggleSatellite() {
    this.setData({ enableSatellite: !this.data.enableSatellite });
  },

  backToCenter() {
    this.setData({ scale: 16, latitude: 25.1415, longitude: 102.7379 });
    if (this.mapCtx) {
      this.mapCtx.moveToLocation();
    }
  },

  onReady() {
    this.mapCtx = wx.createMapContext('campusMap');
  }
});
