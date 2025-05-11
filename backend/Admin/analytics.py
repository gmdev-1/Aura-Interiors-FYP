from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest

class AnalyticsService:
    def __init__(self, property_id: str):
        # Reads credentials from GOOGLE_APPLICATION_CREDENTIALS
        self.client = BetaAnalyticsDataClient()
        self.property_id = property_id

    def run_report(self, start_date="7daysAgo", end_date="today"):
        request = RunReportRequest(
            property=f"properties/{self.property_id}",
            date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
            dimensions=[Dimension(name="date")],
             metrics=[
                Metric(name="activeUsers"),
                Metric(name="eventCount"),
                Metric(name="screenPageViews"),
                Metric(name="engagementRate"),
                Metric(name="sessions"),
                Metric(name="addToCarts"),
                Metric(name="checkouts"),
                Metric(name="ecommercePurchases"),
                Metric(name="purchaseRevenue"),
                Metric(name="totalRevenue"),
            ],
        )
        return self.client.run_report(request)
