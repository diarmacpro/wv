function pR(apiUrl, payload = {}, callback) {
 axios
   .post(apiUrl, payload)
   .then((response) => {
     const result = {
       data: response.data,
       time: new Date().toISOString(),
     };
     callback(null, result);
   })
   .catch((error) => {
     const err = {
       error: error.message || 'Unknown error',
       time: new Date().toISOString(),
     };
     callback(err, null);
   });
}

const stm = (f = '') => {
 const now = new Date();
 const opt = {
   timeZone: 'Asia/Bangkok',
   year: 'numeric',
   month: '2-digit',
   day: '2-digit',
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
   hour12: false,
 };

 const fDt = now
   .toLocaleString('sv-SE', opt)
   .replace(/[/]/g, '-')
   .replace(',', '');

 const ms = now.getMilliseconds().toString().padStart(3, '0');

 if (f === 't') {
   return fDt.split(' ')[0];
 } else if (f === 'w') {
   return fDt.split(' ')[1];
 } else if (f === 'w2') {
   const r = fDt.split(' ')[1].split(':');
   return `${r[0]}:${r[1]}`;
 } else if (f === 'tms') {
   return `${fDt}.${ms}`;
 } else {
   return fDt;
 }
};

function sha256(plainText) {
 const encoder = new TextEncoder();
 const data = encoder.encode(plainText);
 return crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   const hashHex = hashArray
     .map((byte) => byte.toString(16).padStart(2, '0'))
     .join('');
   return hashHex;
 });
}

class Fbs {
 iDt(path, value, callback) {
   const dataRef = ref(db, path);
   if (Array.isArray(value)) {
     value.forEach((item, index) => {
       const itemRef = ref(db, `${path}/${index}`);
       set(itemRef, item);
     });
   } else if (typeof value === 'object') {
     set(dataRef, value);
   }
   if (callback) {
     callback();
   }
 }

 iDtKy(path, value, callback) {
   const dataRef = ref(db, path);
   if (Array.isArray(value)) {
     value.forEach((item) => {
       const newItemRef = push(dataRef);
       set(newItemRef, item);
     });
   } else if (typeof value === 'object') {
     const newItemRef = push(dataRef);
     set(newItemRef, value);
   }
   if (callback) {
     callback();
   }
 }

 gDt(path, filters = null, callback) {
   const dataRef = ref(db, path);
   let queryRef = dataRef;

   if (filters && typeof filters === 'object') {
     for (const [field, value] of Object.entries(filters)) {
       queryRef = query(queryRef, orderByChild(field), equalTo(value));
     }
   }

   get(queryRef)
     .then((snapshot) => {
       if (snapshot.exists()) {
         const data = snapshot.val();
         if (callback) {
           callback(data);
         }
       } else {
         if (callback) {
           callback(null);
         }
       }
     })
     .catch((error) => {
       console.error('Gagal mengambil data:', error);
     });
 }

 upd(path, filter, newData, callback) {
   const dataRef = ref(db, path);
   let queryRef = dataRef;

   if (filter) {
     const field = Object.keys(filter)[0];
     const value = filter[field];
     queryRef = query(dataRef, orderByChild(field), equalTo(value));
   }

   if (Array.isArray(newData)) {
     newData.forEach((item, index) => {
       const itemRef = ref(db, `${path}/${index}`);
       set(itemRef, item);
     });
   } else if (typeof newData === 'object') {
     update(queryRef, newData)
       .then(() => {
         console.log('Data berhasil diperbarui');
         if (callback) {
           callback();
         }
       })
       .catch((error) => {
         console.error('Gagal memperbarui data:', error);
       });
   } else {
     set(queryRef, newData)
       .then(() => {
         console.log('Data berhasil diperbarui');
         if (callback) {
           callback();
         }
       })
       .catch((error) => {
         console.error('Gagal memperbarui data:', error);
       });
   }
 }

 delDt(path, callback) {
   const dataRef = ref(db, path);

   get(dataRef)
     .then((snapshot) => {
       if (snapshot.exists()) {
         remove(dataRef)
           .then(() => {
             if (callback) {
               callback();
             }
           })
           .catch((error) => {
             console.error('Gagal menghapus data:', error);
           });
       } else {
         console.log('Data tidak ditemukan, penghapusan dibatalkan.');
         if (callback) {
           callback();
         }
       }
     })
     .catch((error) => {
       console.error('Gagal memeriksa data:', error);
     });
 }

 gDtOn(path, callback) {
   const dataRef = ref(db, path);
   onValue(dataRef, callback);
 }

 gDtOff(path) {
   const dataRef = ref(db, path);
   off(dataRef);
 }
}
