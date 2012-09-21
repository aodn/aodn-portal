package au.org.emii.portal

public enum FilterTypes {
    STRINGTYPE, DATETYPE, NUMTYPE

    @Override
    String toString(){
        switch(this){
            case STRINGTYPE: return "String"
                break
            case DATETYPE: return "Date"
                break
            case NUMTYPE: return "Number"
                break
        }
    }

    String getKey() { name() }
}
