// import { log } from '@/utils/helpers';

import { GOOGLE_API_KEY } from '@/constants/Variables';

export type NearbyPlacePara = {
  latitude: number;
  longitude: number;
}

export type NearbyResult = {
  name: string;
  vicinity: string;
  lat: string;
  lng: string;
}


export default class Google {
  static async getNearbyPlaces({ latitude, longitude }: NearbyPlacePara, type: 'amenity' | 'establishment' = 'amenity'): Promise<NearbyResult[]> {
    const apiKey = GOOGLE_API_KEY;
    const radius = 2000; // 1 km radius
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      const nearbyPlaces = data.results.map((result: any) => ({
        name: result.name,
        vicinity: result.vicinity,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      }));
  
      return nearbyPlaces;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}