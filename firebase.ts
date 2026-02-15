import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ============================================
// FIRESTORE ORDERS HELPER FUNCTIONS
// ============================================

// Collection reference
export const ordersCollection = collection(db, 'orders');

/**
 * Save a new order to Firestore after successful API order placement
 */
export const saveOrderToFirestore = async (userId: string, orderData: any) => {
  try {
    const orderPayload = {
      userId: userId,
      orderId: orderData.orderId,           // from SMM API
      serviceId: orderData.serviceId,
      serviceName: orderData.serviceName,
      link: orderData.link,
      quantity: orderData.quantity,
      charge: orderData.charge,
      date: orderData.date || new Date().toISOString(),
      status: orderData.status || 'Pending',
      remains: orderData.remains || orderData.quantity,
      start_count: orderData.start_count || '0',
      currency: orderData.currency || 'USD',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(ordersCollection, orderPayload);
    return { id: docRef.id, ...orderPayload };
  } catch (error) {
    console.error("Error saving order to Firestore:", error);
    throw error;
  }
};

/**
 * Get all orders for a specific user
 */
export const getUserOrders = async (userId: string) => {
  try {
    const q = query(
      ordersCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: any[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to ISO strings for easy display
        createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || null
      });
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Update an order's status from SMM API response
 */
export const updateOrderStatus = async (orderDocId: string, statusData: any) => {
  try {
    const orderRef = doc(db, 'orders', orderDocId);
    await updateDoc(orderRef, {
      status: statusData.status,
      remains: statusData.remains,
      charge: statusData.charge,
      start_count: statusData.start_count,
      currency: statusData.currency,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Delete an order (if needed - refund/cancel scenario)
 */
export const deleteOrder = async (orderDocId: string) => {
  try {
    const orderRef = doc(db, 'orders', orderDocId);
    await deleteDoc(orderRef);
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

/**
 * Get a single order by Firestore document ID
 */
export const getOrderById = async (orderDocId: string) => {
  try {
    const orderRef = doc(db, 'orders', orderDocId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data(),
        createdAt: orderSnap.data().createdAt?.toDate?.().toISOString() || null,
        updatedAt: orderSnap.data().updatedAt?.toDate?.().toISOString() || null
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

/**
 * Get orders by status (for filtering)
 */
export const getUserOrdersByStatus = async (userId: string, status: string) => {
  try {
    const q = query(
      ordersCollection,
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: any[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.().toISOString() || null
      });
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw error;
  }
};

/**
 * Batch update multiple orders statuses
 */
export const batchUpdateOrderStatuses = async (updates: { orderDocId: string, statusData: any }[]) => {
  try {
    // Using Promise.all for parallel updates
    const updatePromises = updates.map(update => 
      updateOrderStatus(update.orderDocId, update.statusData)
    );
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error("Error batch updating orders:", error);
    throw error;
  }
};

// ============================================
// EXPORT EVERYTHING
// ============================================
export {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
};

export default app;
