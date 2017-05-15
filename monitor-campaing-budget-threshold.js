/********************************
 * Monitor Campaign Budget Threshold v1.0
 * Changelog v1.0 - First version
 * Created By: Sandro Lonardi
 * Diviac.com
 ********************************/
function main() {

  /********************************
   * Set the percentage of the threshold
  ********************************/
  var alert_threshold = 0.9;

  /********************************
   * Set the email address where you want the alerts to go
  ********************************/
  var alert_email_to = "you@example.com";

  /********************************
   * DO NOT EDIT
  ********************************/
  var script_name = "Monitor Campaign Budget Threshold";
  var script_version = 1.0;
  var alert_body = [];
  var i = 0;

  Logger.log("Starting: " + script_name + " - v" + script_version);

  var campaignIterator = AdWordsApp.campaigns().get();

  while(campaignIterator.hasNext()) {

    var campaign = campaignIterator.next();

    var name = campaign.getName();
    var budget = campaign.getBudget();

    var stats = campaign.getStatsFor("TODAY");
    var costs = stats.getCost();

    if(costs >= budget * alert_threshold) {
      alert_body[i] = campaign.getName() + "Has reached more than " + alert_threshold * 100 + "% of its budget. Cost: " + costs + " - Budget: " + budget;
      i++;
    }
  }

  var content = "Hi,\n\nOne or more campaigns have reached the threshold of " + alert_threshold * 100 + "%.\n\nCampaigns:\n";
  if(alert_body.length > 0) {

    for(var x = 0; x < alert_body.length; x++) {
      content = content + alert_body[x] + "\n";
    }

    MailApp.sendEmail(
      alert_email_to,
      'AdWords: Campaigns reached ' + alert_threshold * 100 + '% of budget',
      content
    );

    Logger.log(alert_body.length + " campaign have spent " + alert_threshold * 100 + "% or more of their budget. An email was sent to " + alert_email_to);
  } else {
    Logger.log("All campaigns are below the " + alert_threshold * 100 + "% threshold");
  }

  Logger.log("Completed: " + script_name + " - v" + script_version);
}