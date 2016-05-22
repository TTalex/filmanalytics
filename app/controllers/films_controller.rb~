class FilmsController < ApplicationController
  def new
  end
  def index
    @films = Film.all.sort_by { |f| f.ImdbRating }.reverse
  end
  def myfilms
    if current_user
      @films = @current_user.films
    else
      redirect_to '/'
    end
  end
  def show
    @film = Film.find(params[:id])
  end
  def random
    @film = Film.find(rand()*1000)
  end

  private
  def convertdate(date)
    datestring = date.month.to_s + '/' + date.day.to_s
    if date.month < 10
        datestring = '0' + datestring
    end
    return datestring
  end
   
  public
  def outtoday
    first_date = convertdate(DateTime.now - 4)
    last_date = convertdate(DateTime.now + 4)
    @films = Film.where("\"Released\" >= ? and \"Released\" <= ?", first_date, last_date).sort_by { |f| f.ImdbRating }.reverse
  end
end
