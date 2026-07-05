import axiosApi from "../index";

export default class InvestorDashboardService {
  getInvestorList() {
    return axiosApi({
      method: "GET",
      url: "/investors",
    });
  }
}
