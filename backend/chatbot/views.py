from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from chatbot.rag_chain import get_rag_chain


class ChatbotView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        user_query = request.data.get("query")
        if not user_query:
            return Response(
                {"error": "No “query” provided in request body."},
                status=status.HTTP_400_BAD_REQUEST
            )

        chain = get_rag_chain()

        # run the chain — use .run() or .invoke() depending on your version
        response = chain.run(user_query) 
        return Response({"response": response})