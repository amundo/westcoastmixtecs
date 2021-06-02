/*

ANNOTATION_DOCUMENT - top level
  HEADER - unique top-level node containing references to media, and arbitrary name/value PROPERTY pairs
    MEDIA_DESCRIPTOR - links to media files

  PROPERTY - generic key-value element. wt actual f.

  TIME_ORDER - array of TIME_SLOTs
    TIME_SLOT - a single point in the timeline

  TIER - array of ANNOTATIONs
    ALIGNABLE_ANNOTATION - ANNOTATION with TIME_SLOT_REF1 and 2
    REF_ANNOTATION - time references are taken from a linked ALIGNABLE_ANNOTATION referenced in ANNOTATION_REF
      ANNOTATION - container for either ALIGNABLE_ANNOTATION or REF_ANNOTATION
        ANNOTATION_VALUE - the content under ANNOTATION (ALIGNABLE|REF)_ANNOTATION

  CONSTRAINT - metadata which describes the four “stereotypes”. useless.
  LINGUISTIC_TYPE - should be called TIER_TYPE ; describes constraints and attributes for a TIER. useless.

*/


let buildTimeSlotIndex = eaf => [...eaf.querySelectorAll('TIME_SLOT')]
  .reduce((index, timeSlot) => { 
    index[timeSlot.getAttribute('TIME_SLOT_ID')] = parseInt(timeSlot.getAttribute('TIME_VALUE'))
    return index 
  }, {})

let extractMediaReference = eaf => {
  /*
  <MEDIA_DESCRIPTOR 
    MEDIA_URL="file:///C:/Users/Carmen/Desktop/New folder (2)/SMD-1026-CHM- espiritus silvestre..WAV" 
    MIME_TYPE="audio/x-wav" 
    RELATIVE_MEDIA_URL="./SMD-1026-CHM- espiritus silvestre..WAV"/>
    */
  return {
    fileName: eaf.querySelector("MEDIA_DESCRIPTOR").getAttribute('RELATIVE_MEDIA_URL'),
    mimeType: eaf.querySelector("MEDIA_DESCRIPTOR").getAttribute('MIME_TYPE')
  }
}

let resolveTimeslots = (timeSlotIndex, annotation) => ({
  start: timeSlotIndex[annotation.getAttribute('TIME_SLOT_REF1')] / 1000,
  end: timeSlotIndex[annotation.getAttribute('TIME_SLOT_REF2')]/ 1000
})

let parseRefAnnotation = (annotation, tierID) => ({
  id: annotation.getAttribute('ANNOTATION_REF'),
  [tierID]:  annotation.querySelector('ANNOTATION_VALUE').textContent
})

let parseAlignableAnnotation = (annotation, tierID, timeSlotIndex) => ({ 
  id: annotation.getAttribute('ANNOTATION_ID'),
  [tierID]: annotation.querySelector('ANNOTATION_VALUE').textContent,
  start: resolveTimeslots(timeSlotIndex, annotation).start,
  end: resolveTimeslots(timeSlotIndex, annotation).end
})

let parseEAF = eaf => {
  let timeSlotIndex = buildTimeSlotIndex(eaf)

  let sentencesById = Array.from(eaf.querySelectorAll('TIER')).reduce((sentencesById, tier) => {  
    let tierID = tier.getAttribute("TIER_ID")

    tier.querySelectorAll('ALIGNABLE_ANNOTATION').forEach(alignableAnnotation => {
      let sentence = parseAlignableAnnotation(alignableAnnotation, tierID, timeSlotIndex)
      sentencesById[sentence.id] = sentence
    })

    tier.querySelectorAll('REF_ANNOTATION').forEach(refAnnotation => {
      let translation = parseRefAnnotation(refAnnotation, tierID)

      console.log(translation)
      sentencesById[translation.id] = Object.assign(sentencesById[translation.id], translation)
    })

    return sentencesById
  }, {})

  let sentences = Object.values(sentencesById)
    .sort((a,b) => a.start > b.start)
    // .forEach(sentence => delete sentence.id) // just an internal elan id, right?

  let metadata = {
    media: extractMediaReference(eaf)
  }

  return {metadata, sentences}
}


let sameTimestamp = (a,b) => a.start == b.start && a.end == b.end 

// let areAligned = (tierA, tierB) => tierA.

// let eaf = new DOMParser().parseFromString(document.firstElementChild.outerHTML, 'application/xml')
// console.table(parseEAF(eaf))

export {parseEAF}