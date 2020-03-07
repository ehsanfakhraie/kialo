from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from debate.models import Claim
from debate.serializers import ClaimSerializer


class upClaim(APIView):
    permission_classes = [IsAuthenticated]
    """
    Retrieve, update or delete a snippet instance.
    """

    def put(self, request, pk, format=None):
        print(request.user)
        try:
            p = Claim.objects.all().get(pk=pk)
        except:
            response_data = {'detail': 'claim_not_found'}
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
        print(p.suggested)
        if p.suggested == 0:
            response_data = {'detail': 'claim_not_valid'}
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)
        if not (request.user == p.for_discussion.owner or request.user in p.for_discussion.managers.all()
                or request.user in p.for_discussion.editors.all()):
            response_data = {'detail': 'only owner and managers and editors of discussion can change claim suggestion '
                                       'status'}
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        p.save2()
        serializer = ClaimSerializer(p)
        return Response(serializer.data, status=status.HTTP_200_OK)
