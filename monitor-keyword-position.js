/********************************
 * Monitor Keyword Position v1.0
 * Changelog v1.0 - First version
 * Created By: Sandro Lonardi
 * Lonardi.org
 ********************************/
function main() {

  /********************************
   * Set the percentage of the threshold
  ********************************/
  var alert_threshold = 0.1;

  /********************************
   * Set the email address where you want the alerts to go
  ********************************/
  var alert_email_to = ["you@example.com", "yourfriend@example.com"];

  /********************************
   * DO NOT EDIT
  ********************************/
  var script_name = "Monitor Keyword Position";
  var script_version = 1.0;
  var alert_body = [];
  var i = 0;

  Logger.log("Starting: " + script_name + " - v" + script_version);

  var campaignIterator = AdWordsApp.campaigns().get();

  while(campaignIterator.hasNext()) {

    var campaign = campaignIterator.next();

    var keywords = campaign.keywords();

    var keywordIterator = keywords.get();

    while(keywordIterator.hasNext()) {

      var keyword = keywordIterator.next();

      var stats_today = keyword.getStatsFor("TODAY");
      var stats_yesterday = keyword.getStatsFor("YESTERDAY");

      if(stats_today <= stats_yesterday * (1 - alert_threshold)){
        alert_body[i] = "Keyword: " + keyword.getText() + " | Match Type: " + keyword.getMatchType() + " went from position " + stats_yesterday + " to position " + stats_today + ". (Campaign: " + keyword.getCampaign() + " Ad Group: " + keyword.getAdGroup() + ")\n";
        i++;
      }
    }
  }

  var content = "Hi,\n\nOne or more keywords are ranking " + alert_threshold * 100 + "% or more worst than yesterday.\n\nKeywords:\n";
  if(alert_body.length > 0) {

    for(var x = 0; x < alert_body.length; x++) {
      content = content + alert_body[x] + "\n";
    }

    MailApp.sendEmail(
      alert_email_to,
      'AdWords: Keywords position dropped by' + alert_threshold * 100 + '% or more',
      content
    );

    Logger.log(alert_body.length + " keywords have dropped their position by " + alert_threshold * 100 + "% or more. An email was sent to " + alert_email_to);
  } else {
    Logger.log("All keywords positions are above the " + alert_threshold * 100 + "% threshold");
  }

  Logger.log("Completed: " + script_name + " - v" + script_version);
}