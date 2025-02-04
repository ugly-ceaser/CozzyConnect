import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorage {
  static async getObject <T>(key: string) {
    try {
      const data = await AsyncStorage.getItem(key);
      if(!data) return null as T
      return JSON.parse(data) as T
    }
    catch (err: any) {
      console.error("ERROR:", err.message)
      return null
    }
  }

  static async deleteItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
      return true
    }
    catch (err: any) {
      return false
    }
  }

  static async getItem(key: string) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data
    }
    catch (err: any) {
      return null
    }
  }

  static async setItem (key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, value)  
    } 
    catch (err: any) {
      console.error("ERROR:", err.message)
    }
  }

  static async setObject (key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))  
    } 
    catch (err: any) {
      console.error("ERROR:", err.message)
    }
  }

}
