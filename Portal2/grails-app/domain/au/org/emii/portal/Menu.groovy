package au.org.emii.portal

class Menu {
    
    String title
    String json
    Boolean active 
    Date editDate 
    
    static mapping = {
        sort "title"
		json type:'text'
    }

    
    static constraints = {
        title(
            nullable:false,
            blank: false, 
            maxSize: 40, 
            unique:true
        )
        json(maxSize: 4000)
    }
    String toString() {
        return "${title}"
    }
}
