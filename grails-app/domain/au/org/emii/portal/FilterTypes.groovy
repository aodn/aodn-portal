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
    String, Date, Number, Boolean,BoundingBox

    String getKey() { name() }
}