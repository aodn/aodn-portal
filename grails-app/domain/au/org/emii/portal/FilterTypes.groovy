package au.org.emii.portal

/**
 * Types of filters a layer can take.
 *
 * To add a new type:
 *
 * 1) Make a new value for the filtertype enumeration.  Note that all possible values are stored
 * as strings in the database.
 * 2) Create an appropriate type in the Javascript, i.e., in web-app/js/portal/filter
 */
public enum FilterTypes {
    STRINGTYPE, DATETYPE, NUMTYPE, BOOLTYPE

    @Override
    String toString(){
        switch(this){
            case STRINGTYPE: return "String"
                break
            case DATETYPE: return "Date"
                break
            case NUMTYPE: return "Number"
                break       
            case BOOLTYPE: return "Boolean"
        }
    }

    String getKey() { name() }
}
