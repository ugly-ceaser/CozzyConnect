export class APIEndpoint {
  public static BASE_URL = "https://cozzyconnect.onrender.com";

  public static register = {
    method: "POST",
    url: this.BASE_URL + "/auth/register",
  };

  public static login = {
    method: "POST",
    url: this.BASE_URL + "/auth/login",
  };

  public static profile = {
    method: "GET",
    url: this.BASE_URL + "/users/profile",
  };

  public static createUpdate = {
    method: "POST",
    url: this.BASE_URL + "/users/",
  };

  public static profileUpdate = {
    method: "PATCH",
    url: this.BASE_URL + "/users/update/",
  };

  public static changePassword = {
    method: "POST",
    url: this.BASE_URL + "/auth/fpwd/:id",
  };

  public static otp = {
    method: "POST",
    url: this.BASE_URL + "/otp/request",
  };

  public static otpVerify = {
    method: "POST",
    url: this.BASE_URL + "/auth/verify/email",
  };

  public static getKyc = {
    method: "GET",
    url: this.BASE_URL + "/verification/",
  };

  public static kycCreate = {
    method: "POST",
    url: this.BASE_URL + "/verification/",
  };

  public static kycUpdate = {
    method: "PATCH",
    url: this.BASE_URL + "/verification/",
  };

  public static getProperties = {
    method: "GET",
    url: this.BASE_URL + "/realEstate?page=:page&limit=:limit",
  };

  public static createProperty = {
    method: "POST",
    url: this.BASE_URL + "/realEstate",
  };

  public static searchProperty = {
    method: "POST",
    url: this.BASE_URL + "/realEstate/search",
  };

  public static getProperty = {
    method: "GET",
    url: this.BASE_URL + "/realEstate/:id",
  };

  public static getReviews = (id: number, page = 1, limit = 100) => ({
    method: "GET",
    url: this.BASE_URL + `/reviews/real-estate/${id}?page=${page}&limit=${limit}`,
  });

  public static createReview = {
    method: "POST",
    url: this.BASE_URL + `/reviews/`,
  };

  public static updateReview = (id: number) => ({
    method: "PATCH",
    url: this.BASE_URL + `/reviews/${id}`,
  });

  public static createContact = {
    method: "POST",
    url: this.BASE_URL + "/contacts",
  };

  public static getNotifications = (page = 1, limit = 12) => ({
    method: "GET",
    url: this.BASE_URL + `/notifications/?page=${page}&limit=${limit}`,
  });
}
