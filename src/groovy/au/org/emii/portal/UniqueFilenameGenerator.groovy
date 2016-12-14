package au.org.emii.portal

class UniqueFilenameGenerator {

    def usedFilenames = [:]

    def generateUniqueFilename(filename, extension = "") {

        def fullFileName = filename + extension
        def currentCount = usedFilenames[fullFileName]

        // First usage of this filename
        if (!currentCount) {
            usedFilenames[fullFileName] = 1

            return filename + extension
        }

        // Subsequent usage of this filename
        currentCount++
        usedFilenames[fullFileName] = currentCount

        return "$filename($currentCount)$extension"
    }
}
