 
def build(dimensions, so_far=None):
    if so_far is None:
        so_far = []
    if len(dimensions) == 0:
        return so_far
    else:
        return [build(dimensions[1:], so_far = so_far+[value]) for value in dimensions[0]]
 


# let brendanReduce = dimensions  => dimensions.reduce((matrix, dimension) => {
#     if(matrix.length === 0){
#       return matrix
#     } else {
#       matrix.push([value])
#       dimensions[0].map(value => brendanReduce(dimensions.slice(1))
#
#     }
#   }, [])



# let brendan = (dimensions, matrix=[]) => {
#   if(dimensions.length === 0){
#     return matrix
#   } else {
#     return dimensions[0].map(value => brendan(dimensions.slice(1), matrix.concat([value])))
#   }
# }
