class CuentaFija {
    constructor(db) {
        this.db = db;
    }

    create(newCuentaFija) {
        return this.db.collection('CuentasFijas').doc()
            .set(newCuentaFija)
    }

    fetch() {
        let query = this.db.collection('CuentasFijas').orderBy('date', 'desc');
        return query.get();
    }

    fetchCurrentMonth() {
        let now = Date.now();
        now = new Date(now);
        let currentMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        let query = this.db.collection('CuentasFijas')
            .where("date", ">", currentMonth)
            .orderBy('date', 'desc');
        return query.get();
    }
    fetchItem(item_id) {
        return this.db.collection('CuentasFijas').doc(item_id).get();
    }

    delete(item_id) {
        const document = this.db.collection('CuentasFijas').doc(item_id);
        return document.delete();
    }
}

module.exports = CuentaFija;