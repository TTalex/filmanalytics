class Film < ActiveRecord::Base
  has_and_belongs_to_many :users
  def formatdate
    d=self.Released.split('/')
    if d.size > 2
      return DateTime.new(d[2].to_i,d[0].to_i,d[1].to_i).strftime("(%d %b %Y)")
    end
    return "N/A"
  end
  
end
