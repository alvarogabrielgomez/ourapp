class Purchases {
    constructor(db) {
        this.db = db;
    }

    create(newPurchase) {
        return this.db.collection('Purchases').doc()
            .set(newPurchase)
    }

    fetchCurrentMonth() {
        let now = Date.now();
        now = new Date(now);
        let currentMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        let query = this.db.collection('Purchases')
            .where("date", ">", currentMonth)
            .orderBy('date', 'desc');
        return query.get();
    }
    fetchItem(item_id) {
        return this.db.collection('Purchases').doc(item_id).get();
    }

    delete(item_id) {
        const document = this.db.collection('Purchases').doc(item_id);
        return document.delete();
    }
    update(purchase) {
        var query = this.db.collection('Purchases').doc(purchase.id);
        return query.update(purchase);
    }
}

module.exports = Purchases;