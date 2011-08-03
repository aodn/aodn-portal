package au.org.emii.portal

class Menu {
    
    String title
    Boolean active 
    Date editDate 
    

    static constraints = {
        title{unique:true}
    }
}
