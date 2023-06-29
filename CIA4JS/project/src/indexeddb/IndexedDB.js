

export let IndexedDB = {
	deleteDb: function () {
		const request = window.indexedDB.deleteDatabase("jcia");
		request.onsuccess = (e) => {
			// console.log("DB deleted successfully");
		};
	},
	insertRecord: function (db, records, key) {
		return new Promise((resolve, reject) => {
			if (db) {
				const insert_transaction = db.transaction("dep-res", "readwrite");
				const store = insert_transaction.objectStore("dep-res");

				insert_transaction.onerror = (e) => {
					// console.log("Problem with transaction");
				};

				insert_transaction.oncomplete = (e) => {
					// console.log("All transaction completed");
				};

				let request = store.add(records, key);

				request.onerror = (e) => {
					// console.log("Could not add ", records);
				};

				request.onsuccess = (e, res) => {
					// console.log("Success add ", records);
					resolve(request.result)
				};
			}
		});
	},
	getRecord: function (db, key) {
		return new Promise((resolve, reject) => {
			if (db) {
				const get_transaction = db.transaction("dep-res", "readonly");
				const store = get_transaction.objectStore("dep-res");

				get_transaction.onerror = (e) => {
					// console.log("Problem with transaction");
				};

				get_transaction.oncomplete = (e) => {
                    // get_transaction.close();
				};

				let request = store.get(key);
				request.onerror = (e) => {
					// console.log("Could not get ", key);
				};

				request.onsuccess = (e) => {
					// // console.log(e.target.result);
                    resolve(request.result)
				};
			}
		});
	},
	updateRecord: function(db, record, key) {
		return new Promise((resolve, reject) => {
			if (db) {
				const update_transaction = db.transaction("dep-res", "readwrite");
				const store = update_transaction.objectStore("dep-res");

				update_transaction.onerror = (e) => {
					// console.log("Problem with transaction");
				};

				update_transaction.oncomplete = (e) => {
					// update_transaction.close();
				};

				let request = store.put(record, key);

				request.onerror = (e) => {
					// console.log("Could not update ", record);
				};

				request.onsuccess = (e) => {
					// console.log("Success update record ", request.result);
					resolve(request.result)
				};
			}
		});
	},
	deleteRecord: function(db, key) {
		if (db) {
			const delete_transaction = db.transaction("dep-res", "readwrite");
			const store = delete_transaction.objectStore("dep-res");

			delete_transaction.onerror = (e) => {
				// console.log("Problem with transaction");
			};

			delete_transaction.oncomplete = (e) => {
				// delete_transaction.close();
			};

			let request = store.delete(key);

			request.onerror = (e) => {
				// console.log("Could not update ", key);
			};

			request.onsuccess = (e) => {
				// console.log("Success update record ", key);
			};
		}
	}
};