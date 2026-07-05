import axiosApi from "../index";

export default class InvestorPortfolioService {
  getInvestorPortfolioList(investorId: string) {
    return axiosApi({
      method: "GET",
      url: `/investors/${investorId}/summary`,
    });
  }

  getInvestorPortfolioSchemeWiseHoldings(investorId: string) {
    return axiosApi({
      method: "GET",
      url: `/investors/${investorId}/schemeSummary`,
    });
  }
}
