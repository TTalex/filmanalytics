class FilmsController < ApplicationController
  private
  def fetch_week(first_date, last_date, startyear, endyear)
    if !startyear
      startyear = 0
    end
    if !endyear || endyear == ''
      endyear = 3000
    end
    return Film.where("Released >= ? and Released < ? and Year >= ? and Year <= ?", first_date, last_date, startyear, endyear).sort_by { |f| f.ImdbRating }.reverse
  end
   
  public
  def data
    puts params
    dates = Array.new(4)
    for k in 0..3
      dates[k] = Array.new(12)
    end
    for i in 1..12
      if i < 10
        weeks = [
                 "0" + i.to_s + "/01",
                 "0" + i.to_s + "/08",
                 "0" + i.to_s + "/15",
                 "0" + i.to_s + "/22",
                 "0" + i.to_s + "/31",
                ]
      else
        weeks = [                 
                 i.to_s + "/01",
                 i.to_s + "/08",
                 i.to_s + "/15",
                 i.to_s + "/22",
                 i.to_s + "/31",
                ]
      end
      for k in 0..3
        films = fetch_week(weeks[k], weeks[k + 1], params["startyear"], params["endyear"])
        dates[k][i-1]= {x:i, y: films.length, films: films}
      end
    end
    respond_to do |format|
      format.json {
        render :json => dates
      }
    end
  end
  def graph
  end
end
